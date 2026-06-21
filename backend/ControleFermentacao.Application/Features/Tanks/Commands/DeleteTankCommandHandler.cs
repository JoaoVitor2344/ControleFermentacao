using ControleFermentacao.Domain.Interfaces;
using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Commands;

public class DeleteTankCommandHandler : IRequestHandler<DeleteTankCommand, bool>
{
    private readonly ITankRepository _tankRepository;

    public DeleteTankCommandHandler(ITankRepository tankRepository)
    {
        _tankRepository = tankRepository;
    }

    public async Task<bool> Handle(DeleteTankCommand request, CancellationToken cancellationToken)
    {
        var tank = await _tankRepository.GetByIdAsync(request.Id);
        if (tank == null) return false;

        await _tankRepository.DeleteAsync(request.Id);
        return true;
    }
}