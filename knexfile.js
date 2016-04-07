module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/q2assessment',
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: './seeds/'
    }

  }
};
