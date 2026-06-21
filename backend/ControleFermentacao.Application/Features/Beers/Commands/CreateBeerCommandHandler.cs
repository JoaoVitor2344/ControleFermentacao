using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.FermentationRecords.Commands;

public class CreateBeerCommandHandler : IRequestHandler<CreateBeerCommand, Guid>
{
    private readonly IBeerRepository _beerRepository;

    public CreateBeerCommandHandler(IBeerRepository beerRepository)
    {
        _beerRepository = beerRepository;
    }

    public async Task<Guid> Handle(CreateBeerCommand request, CancellationToken cancellationToken)
    {
        var beer = new Beer(
            request.Name,
            request.Style,
            request.MinTemperature,
            request.MaxTemperature,
            request.MinPh,
            request.MaxPh,
            request.MinExtract,
            request.MaxExtract
        );

        await _beerRepository.AddAsync(beer);

        return beer.Id;
    }
}