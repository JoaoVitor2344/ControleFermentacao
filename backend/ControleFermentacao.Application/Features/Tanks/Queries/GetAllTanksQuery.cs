using ControleFermentacao.Domain.Entities;
using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Queries;

public class GetAllTanksQuery : IRequest<IEnumerable<Tank>>
{
    // Quando true, a query retorna também os tanques logicamente excluídos (soft delete)
    public bool IncludeDeleted { get; set; } = false;
}
