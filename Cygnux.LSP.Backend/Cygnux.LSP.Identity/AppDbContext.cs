namespace Cygnux.LSP.Identity;

using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
    : base(options: options)
    {
    }

    public virtual DbSet<ApplicationUser> Users { get; set; }

    public virtual DbSet<ApplicationRole> Roles { get; set; }

    public virtual DbSet<IdentityUserRole<Guid>> UserRoles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}