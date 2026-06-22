using ControleFermentacaoCervejeira.Application.Features.Tanks.Commands;
using ControleFermentacaoCervejeira.Application.Features.Tanks.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleFermentacaoCervejeira.Controllers;

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
    public async Task<IActionResult> GetAll(
        [FromQuery] bool includeDeleted = false,
        [FromQuery] string? name = null,
        [FromQuery] decimal? minCapacityLiters = null,
        [FromQuery] decimal? maxCapacityLiters = null)
    {
        var tanks = await _mediator.Send(new GetAllTanksQuery
        {
            IncludeDeleted = includeDeleted,
            Name = name,
            MinCapacityLiters = minCapacityLiters,
            MaxCapacityLiters = maxCapacityLiters
        });
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
        command.Id = id;

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
