using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.FermentationRecords.Commands;

public class DeleteBeerCommandHandler : IRequestHandler<DeleteBeerCommand, bool>
{
    private readonly IBeerRepository _repository;

    public DeleteBeerCommandHandler(IBeerRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(DeleteBeerCommand request, CancellationToken cancellationToken)
    {
        var beer = await _repository.GetByIdAsync(request.Id);
        if (beer == null) return false;

        await _repository.DeleteAsync(request.Id);
        return true;
    }
}