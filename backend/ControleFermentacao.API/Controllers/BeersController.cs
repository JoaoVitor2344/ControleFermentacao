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
}