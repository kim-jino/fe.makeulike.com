/**
 * Using require-dir for each loading tasks
 * @date 160329
 */
var requireDir = require('require-dir');

/** Require all tasks in gulp/tasks, including subfolders */
requireDir('./tasks', { recurse: true });