using ControleFermentacao.Application.Features.FermentationRecords.Commands;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ControleFermentacao.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FermentationController : ControllerBase
{
    private readonly IMediator _mediator;

    public FermentationController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("records")]
    public async Task<IActionResult> RegisterRecord([FromBody] RegisterFermentationCommand command)
    {
        try
        {
            // O MediatR pega o comando e roteia para o RegisterFermentationCommandHandler
            var recordId = await _mediator.Send(command);

            return Ok(new
            {
                Message = "Apontamento de fermentação registrado com sucesso",
                RecordId = recordId
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }
}