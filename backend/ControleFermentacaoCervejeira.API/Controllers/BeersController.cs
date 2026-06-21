using ControleFermentacaoCervejeira.Application.Features.Beers.Commands;
using ControleFermentacaoCervejeira.Application.Features.Beers.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleFermentacaoCervejeira.Controllers;

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
        var beerId = await _mediator.Send(command);
        return Ok(new { Message = "Cerveja cadastrada com sucesso!", BeerId = beerId });
    }

    // includeDeleted: parâmetro opcional de query string para exibir cervejas removidas
    // Exemplo: GET /api/beers?includeDeleted=true
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool includeDeleted = false)
    {
        var beers = await _mediator.Send(new GetAllBeersQuery { IncludeDeleted = includeDeleted });
        return Ok(beers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var beer = await _mediator.Send(new GetBeerByIdQuery(id));

        if (beer == null)
            return NotFound(new { Message = "Cerveja não encontrada." });

        return Ok(beer);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBeerCommand command)
    {
        if (id != command.Id)
            return BadRequest(new { Message = "O ID da rota não bate com o ID do corpo da requisição." });

        var success = await _mediator.Send(command);
        if (!success) return NotFound(new { Message = "Cerveja não encontrada para edição." });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _mediator.Send(new DeleteBeerCommand(id));
        if (!success) return NotFound(new { Message = "Cerveja não encontrada para exclusão." });

        return NoContent();
    }
}