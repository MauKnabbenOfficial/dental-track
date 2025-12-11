import { useState } from "react";
import { Plus, Search, Edit, Trash2, Clock, ListChecks, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useData, StageTemplate } from "@/contexts/DataContext";
import { toast } from "sonner";

export default function StageTemplates() {
  const {
    stageTemplates,
    addStageTemplate,
    updateStageTemplate,
    deleteStageTemplate,
    generateId,
  } = useData();
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<StageTemplate | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state (use PascalCase for runtime; convert when calling DataContext)
  const [formData, setFormData] = useState({
    Nome: "",
    Descricao: "",
    DuracaoPadraoMinutos: 0,
    ItensChecklist: [] as string[],
  });
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const filteredTemplates = stageTemplates.filter(
    (t: any) =>
      (t.nome || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.descricao || "").toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      Nome: "",
      Descricao: "",
      DuracaoPadraoMinutos: 0,
      ItensChecklist: [],
    });
    setNewChecklistItem("");
    setEditingTemplate(null);
  };

  const openEditDialog = (template: any) => {
    setEditingTemplate(template);
    setFormData({
      Nome: (template as any).Nome || template.nome || "",
      Descricao: (template as any).Descricao || template.descricao || "",
      DuracaoPadraoMinutos:
        (template as any).DuracaoPadraoMinutos ||
        template.duracaoPadraoMinutos ||
        0,
      ItensChecklist: [
        ...((template as any).ItensChecklist || template.itensChecklist || []),
      ],
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTemplate) {
      // Convert PascalCase formData to DataContext expected camelCase shape
      updateStageTemplate(editingTemplate.id, {
        nome: (formData as any).Nome,
        descricao: (formData as any).Descricao,
        duracaoPadraoMinutos: (formData as any).DuracaoPadraoMinutos,
        itensChecklist: (formData as any).ItensChecklist,
      } as any);
      toast.success("Modelo de etapa atualizado!");
    } else {
      addStageTemplate({
        id: generateId(),
        nome: (formData as any).Nome,
        descricao: (formData as any).Descricao,
        duracaoPadraoMinutos: (formData as any).DuracaoPadraoMinutos,
        itensChecklist: (formData as any).ItensChecklist,
      } as any);
      toast.success("Modelo de etapa criado!");
    }

    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteStageTemplate(deleteId);
      toast.success("Modelo de etapa excluído!");
      setDeleteId(null);
    }
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        ItensChecklist: [
          ...(prev as any).ItensChecklist,
          newChecklistItem.trim(),
        ],
      }));
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ItensChecklist: (prev as any).ItensChecklist.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Modelos de Etapas
          </h1>
          <p className="text-muted-foreground">
            Cadastre etapas reutilizáveis para procedimentos
          </p>
        </div>
        <Dialog
          open={isFormOpen}
          onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Etapa
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-lg"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? "Editar" : "Cadastrar"} Modelo de Etapa
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome da Etapa</Label>
                <Input
                  placeholder="Ex: Anestesia"
                  value={(formData as any).Nome}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, Nome: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Descreva a etapa..."
                  value={(formData as any).Descricao}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      Descricao: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Duração Estimada (minutos)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 30"
                  min={1}
                  step={1}
                  value={(formData as any).DuracaoPadraoMinutos || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      DuracaoPadraoMinutos: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Itens do Checklist</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Novo item..."
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addChecklistItem())
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addChecklistItem}
                  >
                    Adicionar
                  </Button>
                </div>
                {(formData as any).ItensChecklist.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(formData as any).ItensChecklist.map(
                      (item: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="gap-1">
                          {item}
                          <button
                            type="button"
                            onClick={() => removeChecklistItem(idx)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTemplate ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar modelos de etapa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template: any) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg">
                  {(template as any).Nome || template.nome || "—"}
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeleteId(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {(template as any).Descricao || template.descricao || ""}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {(template as any).DuracaoPadraoMinutos ||
                      template.duracaoPadraoMinutos ||
                      0}{" "}
                    min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ListChecks className="h-4 w-4" />
                  <span>
                    {
                      (
                        (template as any).ItensChecklist ||
                        template.itensChecklist ||
                        []
                      ).length
                    }{" "}
                    itens
                  </span>
                </div>
              </div>
              {(
                (template as any).ItensChecklist ||
                template.itensChecklist ||
                []
              ).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(
                    (template as any).ItensChecklist ||
                    template.itensChecklist ||
                    []
                  )
                    .slice(0, 3)
                    .map((item: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  {(
                    (template as any).ItensChecklist ||
                    template.itensChecklist ||
                    []
                  ).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +
                      {(
                        (template as any).ItensChecklist ||
                        template.itensChecklist ||
                        []
                      ).length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este modelo de etapa? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
