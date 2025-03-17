namespace Cygnux.LSP.Identity.Configuration;

using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.ToTable("Users").HasKey(request => request.Id);

        builder
      .Property(r => r.Id)
      .HasColumnType("uniqueidentifier").IsRequired();

        builder
        .Property(r => r.UserName)
        .HasColumnType("varchar(100)").IsRequired();

        builder
        .Property(r => r.FirstName)
        .HasColumnType("varchar(100)").IsRequired(false);

        builder
        .Property(r => r.LastName)
        .HasColumnType("varchar(100)").IsRequired(false);

        builder
        .Property(r => r.Email)
        .HasColumnType("nvarchar(200)").IsRequired();

        builder
.Property(r => r.EntryDate)
.HasColumnType("datetime").IsRequired();

        builder
.Property(r => r.ConcurrencyStamp)
.HasColumnType("varchar(50)").IsRequired(false);

        builder
.Property(r => r.EmailConfirmed)
.HasColumnType("bit").IsRequired();

        builder
.Property(r => r.LockoutEnabled)
.HasColumnType("bit").IsRequired();

        builder
.Property(r => r.TwoFactorEnabled)
.HasColumnType("bit").IsRequired();

        builder
.Property(r => r.TwoFactorEnabled)
.HasColumnType("bit").IsRequired();

        builder
        .Property(r => r.PhoneNumber)
        .HasColumnType("varchar(15)").IsRequired();

        builder
        .Property(r => r.PasswordHash)
        .HasColumnType("nvarchar(200)").IsRequired();

        builder
        .Property(r => r.SecurityStamp)
        .HasColumnType("varchar(100)").IsRequired();

        builder
        .Property(r => r.EntryBy)
        .HasColumnType("uniqueidentifier").IsRequired();
    }
}