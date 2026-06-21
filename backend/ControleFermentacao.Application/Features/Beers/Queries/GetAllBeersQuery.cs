using ControleFermentacao.Domain.Entities;
using MediatR;

namespace ControleFermentacao.Application.Features.Beers.Queries;

public class GetAllBeersQuery : IRequest<IEnumerable<Beer>>
{
}