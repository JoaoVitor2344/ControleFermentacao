using ControleFermentacao.Domain.Entities;
using MediatR;

namespace ControleFermentacao.Application.Features.Beers.Queries;

public class GetBeerByIdQuery : IRequest<Beer?>
{
    public Guid Id { get; set; }

    public GetBeerByIdQuery(Guid id)
    {
        Id = id;
    }
}