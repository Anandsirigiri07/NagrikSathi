import fs from 'fs';
import path from 'path';

// Use process.cwd() instead of __dirname in ES modules
const root = process.cwd();
const frontendDir = path.join(root, 'frontend');

try {
  // 1. Rename server to backend
  if (fs.existsSync(path.join(root, 'server'))) {
    fs.renameSync(path.join(root, 'server'), path.join(root, 'backend'));
    console.log('✅ Renamed "server" to "backend"');
  }

  // 2. Create frontend folder
  if (!fs.existsSync(frontendDir)) {
    fs.mkdirSync(frontendDir);
    console.log('✅ Created "frontend" folder');
  }

  // 3. Move frontend files
  const items = fs.readdirSync(root);
  const exclude = ['backend', 'frontend', '.git', 'README.md', '.gitignore', 'restructure.js', 'implementation_plan.md', 'task.md', 'walkthrough.md'];

  for (const item of items) {
    if (!exclude.includes(item)) {
      const oldPath = path.join(root, item);
      const newPath = path.join(frontendDir, item);
      fs.renameSync(oldPath, newPath);
      console.log(`✅ Moved "${item}" to frontend/`);
    }
  }

  console.log('\n🎉 Restructuring complete! Your project now matches the requested layout.');
} catch (err) {
  console.error('❌ Error during restructuring:', err);
}
