import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { TOOLS_LIST, handleToolExecution } from "./tools.js";

// Initialize the MCP Server
const server = new Server(
  {
    name: "agrisustain-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Define tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS_LIST
  };
});

// Define tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = handleToolExecution(name, args || {});
    return result;
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            status: "ERROR",
            error: error.message || "An unknown error occurred during tool execution."
          }, null, 2)
        }
      ],
      isError: true
    };
  }
});

// Main runner
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("AgriSustain MCP Server running on Stdio transport.");
}

main().catch((error) => {
  console.error("Critical error in MCP server:", error);
  process.exit(1);
});
