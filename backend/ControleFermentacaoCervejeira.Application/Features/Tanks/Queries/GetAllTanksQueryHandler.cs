using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Tanks.Queries;

public class GetAllTanksQueryHandler : IRequestHandler<GetAllTanksQuery, IEnumerable<Tank>>
{
    private readonly ITankRepository _tankRepository;

    public GetAllTanksQueryHandler(ITankRepository tankRepository)
    {
        _tankRepository = tankRepository;
    }

    public async Task<IEnumerable<Tank>> Handle(GetAllTanksQuery request, CancellationToken cancellationToken)
    {
        if (request.MinCapacityLiters > request.MaxCapacityLiters)
            throw new ArgumentException("A capacidade mínima não pode ser maior que a capacidade máxima.");

        return await _tankRepository.GetAllAsync(
            request.IncludeDeleted,
            request.Name,
            request.MinCapacityLiters,
            request.MaxCapacityLiters);
    }
}
