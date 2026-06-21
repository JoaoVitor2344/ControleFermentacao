using ControleFermentacaoCervejeira.Domain.Entities;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Tanks.Queries;

public class GetAllTanksQuery : IRequest<IEnumerable<Tank>>
{
    // Quando true, a query retorna também os tanques logicamente excluídos (soft delete)
    public bool IncludeDeleted { get; set; } = false;
}
