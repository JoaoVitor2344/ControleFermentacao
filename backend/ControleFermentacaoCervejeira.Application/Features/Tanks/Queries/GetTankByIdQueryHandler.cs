using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Tanks.Queries;

public class GetTankByIdQueryHandler : IRequestHandler<GetTankByIdQuery, Tank?>
{
    private readonly ITankRepository _tankRepository;

    public GetTankByIdQueryHandler(ITankRepository tankRepository)
    {
        _tankRepository = tankRepository;
    }

    public async Task<Tank?> Handle(GetTankByIdQuery request, CancellationToken cancellationToken)
    {
        return await _tankRepository.GetByIdAsync(request.Id);
    }
}