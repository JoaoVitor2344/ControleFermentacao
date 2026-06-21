using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Commands;

public class UpdateTankCommandHandler : IRequestHandler<UpdateTankCommand, bool>
{
    private readonly ITankRepository _tankRepository;

    public UpdateTankCommandHandler(ITankRepository tankRepository)
    {
        _tankRepository = tankRepository;
    }

    public async Task<bool> Handle(UpdateTankCommand request, CancellationToken cancellationToken)
    {
        var tank = await _tankRepository.GetByIdAsync(request.Id);
        if (tank == null) return false;

        tank.Update(request.Name, request.CapacityLiters);

        await _tankRepository.UpdateAsync(tank);
        return true;
    }
}