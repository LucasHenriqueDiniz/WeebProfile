"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ProfileConfigModal } from "./ProfileConfigModal"
import type { PluginWorkspace } from "./usePluginWorkspace"

// Dialogs compartilhados entre a lista e o detalhe (perfil, desbloqueio de secret) -
// montados uma vez, nao duplicados em cada coluna.
export function PluginWorkspaceDialogs({ workspace }: { workspace: PluginWorkspace }) {
  const { showProfileModal, setShowProfileModal, enabledPlugins, unlockDialog, setUnlockDialog, confirmUnlock, refreshSecretsPresence } =
    workspace

  return (
    <>
      <ProfileConfigModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        enabledPlugins={enabledPlugins}
        onSave={async () => {
          await refreshSecretsPresence()
        }}
      />

      <Dialog open={!!unlockDialog} onOpenChange={(open) => !open && setUnlockDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Desbloquear Configuração</DialogTitle>
            <DialogDescription>
              Esta configuração já possui um valor salvo. Ao desbloquear, você poderá alterá-la, mas o valor atual será
              substituído. Deseja continuar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnlockDialog(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmUnlock}>
              Desbloquear e Alterar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
