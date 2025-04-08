function init() {
  defineSchema();
}

function defineSchema() {
  const postSchema = async () => {
    const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
    `;
    const response = await fetch('http://localhost:3000/schema', {
      method: 'POST',
      body: JSON.stringify({ schema }),
    });
    return response;
  };

  postSchema();
}

init();

