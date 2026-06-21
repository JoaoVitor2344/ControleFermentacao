using ControleFermentacao.Application.Features.Tanks.Commands;
using ControleFermentacao.Application.Features.Tanks.Queries;
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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var tanks = await _mediator.Send(new GetAllTanksQuery());
            return Ok(tanks);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var tank = await _mediator.Send(new GetTankByIdQuery(id));

            if (tank == null)
                return NotFound(new { Message = "Tanque não encontrado." });

            return Ok(tank);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTankCommand command)
    {
        try
        {
            if (id != command.Id)
                return BadRequest(new { Message = "O ID da rota não bate com o ID do corpo da requisição" });

            var success = await _mediator.Send(command);
            if (!success) return NotFound(new { Message = "Tanque não encontrado para edição." });

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            var success = await _mediator.Send(new DeleteTankCommand(id));
            if (!success) return NotFound(new { Message = "Tanque não encontrado para exclusão" });

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}