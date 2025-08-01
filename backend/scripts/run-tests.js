#!/usr/bin/env node

const SystemTester = require("../tests/test-system")

async function main() {
  console.log("🧪 Executando testes do sistema de coleta de lixo...\n")

  const tester = new SystemTester()

  try {
    const report = await tester.generateTestReport()

    // Código de saída baseado no resultado
    process.exit(report.summary.success ? 0 : 1)
  } catch (error) {
    console.error("❌ Erro crítico nos testes:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
