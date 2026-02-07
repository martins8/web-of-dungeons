import database from "src/infra/database";

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
    //opened connections
    const databaseName = process.env.POSTGRES_DB;
    const openedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });
    const openedConnectionsValue = openedConnectionsResult.rows[0].count;
    console.log("🛜 opened connections:", openedConnectionsValue);
    //response
    return Response.json({
      updated_at: updated_at,
      database: {
        version: versionValue,
        max_connections: maxConnectionsValue,
        opened_connections: openedConnectionsValue,
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
