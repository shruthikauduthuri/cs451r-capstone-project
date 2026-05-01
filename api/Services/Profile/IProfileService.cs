using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Services.Profile
{
    public interface IProfileService
    {
        Task CreateProfile(Models.Profile profile);
    }
}