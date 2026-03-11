import { NodeSDK } from '@opentelemetry/sdk-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-grpc';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

// 1. 자동 계측 도구들 (HTTP, NestJS, DB 등)
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// 2. 런타임 전용 계측 (GC, Heap 등 - 아까 설치한 패키지)
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node';

import * as dotenv from 'dotenv';
dotenv.config();

const sdk = new NodeSDK({
  serviceName: process.env.OTEL_SERVICE_NAME,

  // 메트릭 설정 (metricReaders 사용)
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    }),
    exportIntervalMillis: 60000, // 1분 단위 전송 (필요시 조정)
  }),

  // 트레이스 설정 (traceExporter 사용)
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }),

  // 로그 설정 (logRecordProcessors 사용)
  logRecordProcessors: [
    new BatchLogRecordProcessor(
      new OTLPLogExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      }),
    ),
  ],

  // 계측 도구 등록 (핵심 부분!)
  instrumentations: [
    getNodeAutoInstrumentations(), // HTTP, Express 등 자동 수집
    new RuntimeNodeInstrumentation(), // 런타임(GC, Heap) 상세 수집
  ],
});

sdk.start();

// SDK Graceful Shutdown
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('OTel SDK terminated'))
    .catch((error) => console.error('Error terminating OTel SDK', error))
    .finally(() => process.exit(0));
});
