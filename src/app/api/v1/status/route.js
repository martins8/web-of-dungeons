import database from "src/infra/database.js";

//server status endpoint
export async function GET(request) {
  try {
    //updated_at
    const updated_at = new Date().toISOString();
    //version
    const versionResult = await database.query("SHOW server_version;");
    const versionValue = versionResult.rows[0].server_version;
    //max connections
    const maxConnectionsResult = await database.query("SHOW max_connections;");
    const maxConnectionsValue = parseInt(
      maxConnectionsResult.rows[0].max_connections,
    );
    return Response.json({
      database: {
        updated_at: updated_at,
        version: versionValue,
        max_connections: maxConnectionsValue,
      },
      status: "200",
    });
  } catch (error) {
    return Response.json({
      error: error,
      status: "500",
    });
  }
}
