using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Endpoints
{
    public static class PrivacyEndpoints
    {
        public static void MapPrivacyEndpoints(this WebApplication app)
        {
            app.MapGet("/privacy", () => "This is the privacy policy endpoint.").WithTags("Privacy");
        }
    }
}