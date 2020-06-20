using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Activities;
using FluentValidation.AspNetCore;
using API.Middleware;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // NOTES: SECTION 2:
            // Configuring project with Sqlite Conntection String
            // Write down below code & Add Connection string to appsetting.json file
            services.AddDbContext<DataContext>(
                opt => {
                    opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
                }
            );
            // NOTES:----------------------------
            // Adding cross-origin cors policy
            // Add the Policy to the middleware for the confugure() method 
            services.AddCors(
                opt => {
                    opt.AddPolicy("CorsPolicy", policy => {
                        policy.AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:3000");
                    });
                });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddControllers()
                .AddFluentValidation(cfg => 
                {
                    cfg.RegisterValidatorsFromAssemblyContaining<Create>();
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();

            }

            // Redirects any request to https
            // app.UseHttpsRedirection();

            // When request comes it to api api need to route to appropriate controller
            app.UseRouting();

            app.UseAuthorization();
            // NOTES:----------------------------
            // Adding cors as middleware in this method that was declared in configureservices method
            app.UseCors("CorsPolicy");
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
