/**
 * Strapi application lifecycle callbacks.
 */
export default {
  /** Runs before application initialization */
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    try {
      const publicRole = await strapi
        .query("plugin::users-permissions.role")
        .findOne({ where: { type: "public" } });

      if (publicRole) {
        const apis = ["page", "header", "footer"];
        const actions = ["find", "findOne"];

        for (const api of apis) {
          for (const action of actions) {
            const actionId = `api::${api}.${api}.${action}`;
            const existing = await strapi
              .query("plugin::users-permissions.permission")
              .findOne({
                where: {
                  action: actionId,
                  role: publicRole.id,
                },
              });

            if (!existing) {
              await strapi
                .query("plugin::users-permissions.permission")
                .create({
                  data: {
                    action: actionId,
                    role: publicRole.id,
                  },
                });
            }
          }
        }
        console.log("[Bootstrap] Verified public permissions for page, header, footer");
      }
    } catch (err) {
      console.warn("[Bootstrap] Could not auto-set permissions:", err);
    }
  },
};
