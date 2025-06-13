import { redisClient } from '../config/redis.js';

export const setupFormSockets = (io) => {
  const formNamespace = io.of('/form');

  formNamespace.on('connection', (socket) => {
    socket.on('join_form', async ({ formId, username }) => {
      socket.join(formId);
      await redisClient.hSet(`form:${formId}:users`, socket.id, username);
    });

    socket.on('edit_field', async ({ formId, fieldId, value, username }) => {
      const currentLock = await redisClient.get(`lock:${fieldId}`);
      if (currentLock && currentLock !== socket.id) return;
      
      await prisma.responseEntry.upsert({
        where: { fieldId_responseId: { fieldId, responseId: formId } },
        update: { value, lastEditedBy: username },
        create: {
          responseId: formId,
          fieldId,
          value,
          lastEditedBy: username
        }
      });
      
      formNamespace.to(formId).emit('field_updated', { fieldId, value, by: username });
    });
  });
};
