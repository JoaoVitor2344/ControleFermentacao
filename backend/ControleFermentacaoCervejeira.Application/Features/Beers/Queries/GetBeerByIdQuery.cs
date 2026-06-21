using ControleFermentacaoCervejeira.Domain.Entities;
using MediatR;

namespace ControleFermentacaoCervejeira.Application.Features.Beers.Queries;

public class GetBeerByIdQuery : IRequest<Beer?>
{
    public Guid Id { get; set; }

    public GetBeerByIdQuery(Guid id)
    {
        Id = id;
    }
}