using ControleFermentacao.Application.Features.Tanks.Commands;
using ControleFermentacao.Application.Features.Tanks.Queries;
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
        var tankId = await _mediator.Send(command);
        return Ok(new { Message = "Tanque cadastrado com sucesso!", TankId = tankId });
    }

    // includeDeleted: parâmetro opcional de query string para exibir tanques removidos
    // Exemplo: GET /api/tanks?includeDeleted=true
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeDeleted = false)
    {
        var tanks = await _mediator.Send(new GetAllTanksQuery { IncludeDeleted = includeDeleted });
        return Ok(tanks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var tank = await _mediator.Send(new GetTankByIdQuery(id));

        if (tank == null)
            return NotFound(new { Message = "Tanque não encontrado." });

        return Ok(tank);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTankCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { Message = "O ID da rota não bate com o ID do corpo da requisição" });

        var success = await _mediator.Send(command);
        if (!success) return NotFound(new { Message = "Tanque não encontrado para edição." });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _mediator.Send(new DeleteTankCommand(id));
        if (!success) return NotFound(new { Message = "Tanque não encontrado para exclusão" });

        return NoContent();
    }
}
