namespace Cygnux.LSP.Identity.Configuration;

using Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

internal class ApplicationRoleConfiguration : IEntityTypeConfiguration<ApplicationRole>
{
    public void Configure(EntityTypeBuilder<ApplicationRole> builder)
    {
        builder.ToTable("Roles").HasKey(request => request.Id);

        builder
  .Property(r => r.Id)
  .HasColumnType("uniqueidentifier").IsRequired();

        builder
   .Property(r => r.Name)
   .HasColumnType("varchar(100)").IsRequired();

        builder
  .Property(r => r.NormalizedName)
  .HasColumnType("varchar(100)").IsRequired(false);

        builder
.Property(r => r.ConcurrencyStamp)
.HasColumnType("varchar(50)").IsRequired(false);

        builder
.Property(r => r.EntryDate)
.HasColumnType("Datetime").IsRequired();

        builder
   .Property(r => r.EntryBy)
   .HasColumnType("varchar(50)").IsRequired();
    }
}