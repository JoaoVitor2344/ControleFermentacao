using ControleFermentacao.Domain.Entities;
using MediatR;

namespace ControleFermentacao.Application.Features.Tanks.Queries;

public class GetAllTanksQuery : IRequest<IEnumerable<Tank>>
{
}