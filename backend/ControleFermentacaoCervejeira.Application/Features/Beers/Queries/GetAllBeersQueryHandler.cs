using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Beers.Queries;

public class GetAllBeersQueryHandler : IRequestHandler<GetAllBeersQuery, IEnumerable<Beer>>
{
    private readonly IBeerRepository _beerRepository;

    public GetAllBeersQueryHandler(IBeerRepository beerRepository)
    {
        _beerRepository = beerRepository;
    }

    public async Task<IEnumerable<Beer>> Handle(GetAllBeersQuery request, CancellationToken cancellationToken)
    {
        return await _beerRepository.GetAllAsync(request.IncludeDeleted, request.Name, request.Style);
    }
}
