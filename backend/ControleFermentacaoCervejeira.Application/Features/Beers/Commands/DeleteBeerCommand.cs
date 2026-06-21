using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.FermentationRecords.Commands;

public class DeleteBeerCommand : IRequest<bool>
{
    public Guid Id { get; set; }

    public DeleteBeerCommand(Guid id)
    {
        Id = id;
    }
}