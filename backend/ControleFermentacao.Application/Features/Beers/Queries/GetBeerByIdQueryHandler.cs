using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.Beers.Queries;

public class GetBeerByIdQueryHandler : IRequestHandler<GetBeerByIdQuery, Beer?>
{
    private readonly IBeerRepository _beerRepository;

    public GetBeerByIdQueryHandler(IBeerRepository beerRepository)
    {
        _beerRepository = beerRepository;
    }

    public async Task<Beer?> Handle(GetBeerByIdQuery request, CancellationToken cancellationToken)
    {
        return await _beerRepository.GetByIdAsync(request.Id);
    }
}