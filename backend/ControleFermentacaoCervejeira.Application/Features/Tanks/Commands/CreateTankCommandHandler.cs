using ControleFermentacaoCervejeira.Domain.Entities;
using ControleFermentacaoCervejeira.Domain.Interfaces;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Tanks.Commands;

public class CreateTankCommandHandler : IRequestHandler<CreateTankCommand, Guid>
{
    private readonly ITankRepository _tankRepository;

    public CreateTankCommandHandler(ITankRepository tankRepository)
    {
        _tankRepository = tankRepository;
    }

    public async Task<Guid> Handle(CreateTankCommand request, CancellationToken cancellationToken)
    {
        var tank = new Tank(request.Name, request.Capacity);

        await _tankRepository.AddAsync(tank);

        return tank.Id;
    }
}