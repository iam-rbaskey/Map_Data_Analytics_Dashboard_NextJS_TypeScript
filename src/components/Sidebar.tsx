
'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';
import { PanelRightOpen } from 'lucide-react';
import PolygonManager from './PolygonManager';

export default function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background/90"
          aria-label="Open sidebar"
        >
          <PanelRightOpen className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-6">
          <SheetTitle>MeteoMapper Controls</SheetTitle>
          <SheetDescription>
            Manage your polygons and their data visualization rules here.
          </SheetDescription>
        </SheetHeader>
        <div className="h-[calc(100%-120px)] overflow-y-auto">
          <PolygonManager />
        </div>
      </SheetContent>
    </Sheet>
  );
}
