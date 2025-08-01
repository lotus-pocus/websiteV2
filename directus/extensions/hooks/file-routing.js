// export default function registerHook({ filter }) {
//   filter('file.upload', async (input, { accountability }) => {
//     const collection = accountability?.collection || 'misc';
//     const timestamp = Date.now();
//     const safeFilename = input.filename_download.replace(/\s+/g, '-');

//     input.filename_disk = `${collection}/${timestamp}-${safeFilename}`;
//     return input;
//   });
// }
