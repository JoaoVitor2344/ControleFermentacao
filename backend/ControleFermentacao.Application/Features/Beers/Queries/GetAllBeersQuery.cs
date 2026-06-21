using ControleFermentacao.Domain.Entities;
using MediatR;

namespace ControleFermentacao.Application.Features.Beers.Queries;

public class GetAllBeersQuery : IRequest<IEnumerable<Beer>>
{
    // Quando true, a query retorna também as cervejas logicamente excluídas (soft delete)
    public bool IncludeDeleted { get; set; } = false;
}
