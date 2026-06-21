using ControleFermentacao.Application.Features.Tanks.Commands;
using ControleFermentacao.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleFermentacao.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TanksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TanksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateTankCommand command)
    {
        try
        {
            var tankId = await _mediator.Send(command);
            return Ok(new { Message = "Tanque cadastrado com sucesso!", TankId = tankId });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}