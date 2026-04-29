using Supabase;
using Supabase.Gotrue;
using api.Contracts.Auth;
using api.Endpoints;
using api.Services.Auth;
using api.Services.Profile;
using api.Models;
using Xunit;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc.ModelBinding;

public class AuthEndpointsTests
{
    private readonly Mock<IAuthService> _authMock = new();
    private readonly Mock<IProfileService> _profileMock = new();

    // ---------------- REGISTER ----------------

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenEmailMissing()
    {
        var request = new RegisterRequest { Email = "", Password = "pass" };

        var result = await AuthEndpoints.Register(
            _authMock.Object,
            _profileMock.Object,
            request);

        var bad = Assert.IsType<BadRequest<string>>(result);
        Assert.Equal("Email is required", bad.Value);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenSignupFails()
    {
        _authMock.Setup(a => a.SignUp(It.IsAny<string>(), It.IsAny<string>()))
                 .ReturnsAsync((null, null, null));

        var request = new RegisterRequest { Email = "test@test.com", Password = "pass" };

        var result = await AuthEndpoints.Register(
            _authMock.Object,
            _profileMock.Object,
            request);

        var bad = Assert.IsType<BadRequest<string>>(result);
        Assert.Equal("Registration failed", bad.Value);
    }

    [Fact]
    public async Task Register_ReturnsBadRequest_WhenUserIdInvalid()
    {
        _authMock.Setup(a => a.SignUp(It.IsAny<string>(), It.IsAny<string>()))
                 .ReturnsAsync(("abc", "test@test.com", "token")); // not numeric

        var request = new RegisterRequest { Email = "test@test.com", Password = "pass" };

        var result = await AuthEndpoints.Register(
            _authMock.Object,
            _profileMock.Object,
            request);

        var bad = Assert.IsType<BadRequest<string>>(result);
        Assert.Equal("Invalid user ID", bad.Value);
    }

    [Fact]
    public async Task Register_CreatesProfile_AndReturnsOk_WhenSuccessful()
    {
        _authMock.Setup(a => a.SignUp(It.IsAny<string>(), It.IsAny<string>()))
                 .ReturnsAsync(("123", "test@test.com", "token"));

        var request = new RegisterRequest { Email = "test@test.com", Password = "pass" };

        var result = await AuthEndpoints.Register(
            _authMock.Object,
            _profileMock.Object,
            request);

        _profileMock.Verify(p => p.CreateProfile(It.IsAny<Profile>()), Times.Once);

        var ok = Assert.IsType<Ok<object>>(result);
    }

    // ---------------- LOGIN ----------------

    [Fact]
    public async Task Login_ReturnsUnauthorized_WhenInvalidCredentials()
    {
        _authMock.Setup(a => a.SignIn(It.IsAny<string>(), It.IsAny<string>()))
                 .ReturnsAsync((null, null, null));

        var result = await AuthEndpoints.Login(
            _authMock.Object,
            new LoginRequest { Email = "test@test.com", Password = "wrong" });

        Assert.IsType<UnauthorizedHttpResult>(result);
    }

    [Fact]
    public async Task Login_ReturnsOk_WhenValid()
    {
        _authMock.Setup(a => a.SignIn(It.IsAny<string>(), It.IsAny<string>()))
                 .ReturnsAsync(("1", "test@test.com", "token"));

        var result = await AuthEndpoints.Login(
            _authMock.Object,
            new LoginRequest { Email = "test@test.com", Password = "pass" });

        var ok = Assert.IsType<Ok<object>>(result);
    }

    // ---------------- LOGOUT ----------------

    [Fact]
    public async Task Logout_CallsSignOut_AndReturnsOk()
    {
        var result = await AuthEndpoints.Logout(_authMock.Object);

        _authMock.Verify(a => a.SignOut(), Times.Once);
        Assert.IsType<Ok>(result);
    }

    // ---------------- RESET PASSWORD ----------------

    [Fact]
    public async Task ResetPassword_CallsService_AndReturnsOk()
    {
        var request = new ResetPasswordRequest { Email = "test@test.com" };

        var result = await AuthEndpoints.ResetPassword(
            _authMock.Object,
            request);

        _authMock.Verify(a => a.ResetPassword("test@test.com"), Times.Once);

        var ok = Assert.IsType<Ok<string>>(result);
        Assert.Equal("Password reset email sent.", ok.Value);
    }

    // ---------------- SESSION ----------------

    [Fact]
    public async Task GetSession_ReturnsUnauthorized_WhenNoSession()
    {
        _authMock.Setup(a => a.GetSession())
                 .Returns((ValueTuple<string?, string?>?)null);

        var result = await AuthEndpoints.GetSession(_authMock.Object);

        Assert.IsType<UnauthorizedHttpResult>(result);
    }

    [Fact]
    public async Task GetSession_ReturnsOk_WhenSessionExists()
    {
        _authMock.Setup(a => a.GetSession())
                 .Returns(("1", "test@test.com"));

        var result = await AuthEndpoints.GetSession(_authMock.Object);

        var ok = Assert.IsType<Ok<object>>(result);
    }
}