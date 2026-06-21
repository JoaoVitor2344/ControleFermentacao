using MediatR;

namespace ControleFermentacao.Application.Features.FermentationRecords.Commands;

public class RegisterFermentationCommand : IRequest<Guid>
{
    public Guid BeerId { get; set; }
    public Guid TankId { get; set; }
    public string BatchNumber { get; set; } = string.Empty;
    public decimal Temperature { get; set; }
    public decimal Ph { get; set; }
    public decimal Extract { get; set; }
    public string Notes { get; set; } = string.Empty;
}