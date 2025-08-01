module.exports = {
  storage: {
    s3: {
      driver: 's3',
      key: process.env.STORAGE_S3_KEY,
      secret: process.env.STORAGE_S3_SECRET,
      bucket: process.env.STORAGE_S3_BUCKET,
      region: process.env.STORAGE_S3_REGION,
      // No root = uploads go to S3 root
    },
  },

  hooks: {
    // Optional: Assign to Directus folder (this is visual only)
    'file.upload': async ({ payload, database }) => {
      const heroRow = await database
        .from('hero_section')
        .select('video')
        .where({ video: payload.id })
        .first();

      if (heroRow) {
        const folder = await database
          .from('directus_folders')
          .select('id')
          .where({ name: 'hero_section' })
          .first();

        if (folder) {
          payload.folder = folder.id;
        }
      }

      payload.storage = 's3';
      return payload;
    },
  },
};
