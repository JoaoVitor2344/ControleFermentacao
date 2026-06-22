using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Beers.Commands;

public class UpdateBeerCommandHandler : IRequestHandler<UpdateBeerCommand, bool>
{
    private readonly IBeerRepository _repository;

    public UpdateBeerCommandHandler(IBeerRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(UpdateBeerCommand request, CancellationToken cancellationToken)
    {
        var beer = await _repository.GetByIdAsync(request.Id);
        if (beer == null) return false;

        beer.Update(request.Name, request.Style, request.MinTemperature, request.MaxTemperature,
            request.MinPh, request.MaxPh, request.MinExtract, request.MaxExtract);

        await _repository.UpdateAsync(beer);
        return true;
    }
}