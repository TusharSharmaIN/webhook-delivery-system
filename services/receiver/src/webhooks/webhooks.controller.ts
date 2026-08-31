import { Controller, Post, Req, Res, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ReceiverConfigService } from '../config/receiver-config.service';
import { verifySignature } from '../common/signing.util';

const seenEventIds = new Set<string>();

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly configService: ReceiverConfigService) {}

  @Post('incoming')
  @ApiOperation({
    summary: 'Receive a webhook delivery (simulates a customer endpoint)',
  })
  async receive(@Req() req: Request, @Res() res: Response) {
    const mode = this.configService.getFailureMode();

    if (mode === 'down') return;
    if (mode === 'slow')
      await new Promise((resolve) => setTimeout(resolve, 8000));
    if (mode === 'always-fail') {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Simulated failure' });
    }

    const rawBody = (req as any).rawBody?.toString('utf8');
    const signature = req.headers['x-webhook-signature'] as string;
    const eventId = req.headers['x-event-id'] as string;
    const customerId = req.headers['x-customer-id'] as string;

    const secret = customerId ? this.configService.getSecret(customerId) : null;

    if (!secret) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: `No secret registered for customer ${customerId}`,
      });
    }

    if (
      !rawBody ||
      !signature ||
      !verifySignature(rawBody, signature, secret)
    ) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: 'Invalid signature' });
    }

    if (eventId && seenEventIds.has(eventId)) {
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Duplicate, already processed' });
    }
    if (eventId) seenEventIds.add(eventId);

    console.log(
      `✅ Received valid webhook from customer ${customerId}, event ${eventId}`,
    );
    return res.status(HttpStatus.OK).json({ message: 'Received' });
  }
}
