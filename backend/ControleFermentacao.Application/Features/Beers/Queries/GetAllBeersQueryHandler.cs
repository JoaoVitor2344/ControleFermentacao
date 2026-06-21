using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.Beers.Queries;

public class GetAllBeersQueryHandler : IRequestHandler<GetAllBeersQuery, IEnumerable<Beer>>
{
    private readonly IBeerRepository _beerRepository;

    public GetAllBeersQueryHandler(IBeerRepository beerRepository)
    {
        _beerRepository = beerRepository;
    }

    public async Task<IEnumerable<Beer>> Handle(GetAllBeersQuery request, CancellationToken cancellationToken)
    {
        // Repassa o parâmetro para o repositório, que decide se ignora o filtro de soft delete
        return await _beerRepository.GetAllAsync(request.IncludeDeleted);
    }
}
