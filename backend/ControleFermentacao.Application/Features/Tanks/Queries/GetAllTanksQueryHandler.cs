using ControleFermentacao.Domain.Entities;
using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Queries;

public class GetAllTanksQueryHandler : IRequestHandler<GetAllTanksQuery, IEnumerable<Tank>>
{
    private readonly ITankRepository _tankRepository;

    public GetAllTanksQueryHandler(ITankRepository tankRepository)
    {
        _tankRepository = tankRepository;
    }

    public async Task<IEnumerable<Tank>> Handle(GetAllTanksQuery request, CancellationToken cancellationToken)
    {
        return await _tankRepository.GetAllAsync();
    }
}