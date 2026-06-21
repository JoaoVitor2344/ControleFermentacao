using ControleFermentacao.Application.Features.Beers.Queries;
using ControleFermentacao.Application.Features.FermentationRecords.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleFermentacao.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BeersController : ControllerBase
{
    private readonly IMediator _mediator;

    public BeersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBeerCommand command)
    {
        try
        {
            var beerId = await _mediator.Send(command);
            return Ok(new { Message = "Cerveja cadastrada com sucesso!", BeerId = beerId });
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
            var beers = await _mediator.Send(new GetAllBeersQuery());
            return Ok(beers);
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
            var beer = await _mediator.Send(new GetBeerByIdQuery(id));

            if (beer == null)
                return NotFound(new { Message = "Cerveja não encontrada." });

            return Ok(beer);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBeerCommand command)
    {
        try
        {
            if (id != command.Id)
                return BadRequest(new { Message = "O ID da rota não bate com o ID do corpo da requisição." });

            var success = await _mediator.Send(command);
            if (!success) return NotFound(new { Message = "Cerveja não encontrada para edição." });

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
            var success = await _mediator.Send(new DeleteBeerCommand(id));
            if (!success) return NotFound(new { Message = "Cerveja não encontrada para exclusão." });

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}