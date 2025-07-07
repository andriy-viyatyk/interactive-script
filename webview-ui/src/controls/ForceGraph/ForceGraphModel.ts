import * as d3 from "d3";
import { zoom as d3Zoom, D3ZoomEvent } from "d3-zoom";
import { drag as d3Drag, D3DragEvent } from "d3-drag";
import { GraphData, Node, Link, linkIds } from "./types";
import { forceProperties } from "./constants";
import { TComponentModel } from "../../common/classes/model";
import color from "../../theme/color";

export interface ActiveState {
    activeId: string;
    activeChild: Set<string>;
    hoveredId: string;
    hoveredChild: Set<string>;
}

export const defaultForceGraphState = {
    dimensions: { width: 0, height: 0 },
    activeId: "",
    activeChild: new Set<string>(),
    hoveredId: "",
    hoveredChild: new Set<string>(),
    transform: d3.zoomIdentity,
};

export type ForceGraphState = typeof defaultForceGraphState;

export interface ForceGraphProps {
    graphData: GraphData;
}

export class ForceGraphModel extends TComponentModel<
    ForceGraphState,
    ForceGraphProps
> {
    canvas: HTMLCanvasElement | null = null;
    simulation: d3.Simulation<Node, Link> | null = null;
    isDraggingNode: boolean = false;
    graphData: GraphData = { nodes: [], links: [] };
    labelColors = color.graph.getLabelColors();

    setProps = () => {
        if (this.oldProps?.graphData !== this.props.graphData) {
            this.graphData = JSON.parse(JSON.stringify(this.props.graphData));
        }
    }

    setCanvasRef = (ref: HTMLCanvasElement | null) => {
        this.canvas = ref;
        if (this.canvas && !this.simulation) {
            this.simulation = d3.forceSimulation<Node, Link>([]);
            this.simulation.on("tick", this.renderData);
            this.addDrag();
            this.addZoom();
            this.handleResize();
        }
    };

    setDimensions = (width: number, height: number) => {
        const current = this.state.get().dimensions;
        if (current.width !== width || current.height !== height) {
            this.state.update((s) => {
                s.dimensions = { width, height };
            });

            if (this.canvas && width > 0 && height > 0) {
                const dpr = window.devicePixelRatio || 1;
                const context = this.canvas.getContext("2d");

                if (context) {
                    this.canvas.width = width * dpr;
                    this.canvas.height = height * dpr;
                    context.scale(dpr, dpr);
                }
            }

            setTimeout(() => {
                this.updateSimulation(this.graphData, true);
            }, 0);
        }
    };

    updateData = () => {
        this.updateSimulation(this.graphData, false);
    }

    update = () => {
        this.labelColors = color.graph.getLabelColors();
        setTimeout(() => {
            this.renderData();
        }, 0);
    };

    setTransform = (transform: d3.ZoomTransform) => {
        this.state.update((s) => {
            s.transform = transform;
        });
        this.update();
    };

    handleResize = () => {
        const canvas = d3.select(this.canvas);
        const newWidth = canvas.node()?.getBoundingClientRect().width || 0;
        const newHeight = canvas.node()?.getBoundingClientRect().height || 0;
        this.setDimensions(newWidth, newHeight);
    };

    updateForces = (links: Link[]) => {
        const dimensions = this.state.get().dimensions;
        if (
            !this.simulation ||
            dimensions.width === 0 ||
            dimensions.height === 0
        ) {
            return;
        }

        // Apply properties to each of the forces
        this.simulation
            .force(
                "center",
                forceProperties.center.enabled
                    ? d3.forceCenter(
                          dimensions.width * forceProperties.center.x,
                          dimensions.height * forceProperties.center.y
                      )
                    : null
            )
            .force(
                "charge",
                forceProperties.charge.enabled
                    ? d3
                          .forceManyBody()
                          .strength(forceProperties.charge.strength)
                          .distanceMin(forceProperties.charge.distanceMin)
                          .distanceMax(forceProperties.charge.distanceMax)
                    : null
            )
            .force(
                "collide",
                forceProperties.collide.enabled
                    ? d3
                          .forceCollide<Node>()
                          .strength(forceProperties.collide.strength)
                          .radius(forceProperties.collide.radius)
                          .iterations(forceProperties.collide.iterations)
                    : null
            )
            .force(
                "forceX",
                forceProperties.forceX.enabled
                    ? d3
                          .forceX<Node>()
                          .strength(forceProperties.forceX.strength)
                          .x(dimensions.width * forceProperties.forceX.x)
                    : null
            )
            .force(
                "forceY",
                forceProperties.forceY.enabled
                    ? d3
                          .forceY<Node>()
                          .strength(forceProperties.forceY.strength)
                          .y(dimensions.height * forceProperties.forceY.y)
                    : null
            )
            .force(
                "link",
                forceProperties.link.enabled
                    ? d3
                          .forceLink<Node, Link>(links)
                          .id((d) => d.id)
                          .distance(forceProperties.link.distance)
                          .iterations(forceProperties.link.iterations)
                    : null
            );

        // Restart the simulation to apply new forces
        this.simulation.alpha(1).restart();
    };

    updateSimulation = (graphData: GraphData, onlyForces: boolean = false) => {
        if (!onlyForces) {
            this.simulation?.nodes(graphData.nodes);
        }
        this.updateForces(graphData.links);
    };

    setActiveId = (activeId: string) => {
        let activeChild = new Set<string>();
        if (activeId) {
            const links = this.graphData.links
                .filter((link) => {
                    const { source, target } = linkIds(link);
                    return source === activeId || target === activeId;
                })
                .flatMap((link) => {
                    const { source, target } = linkIds(link);
                    return [source, target].filter((id) => id !== activeId);
                });

            activeChild = new Set(links);
        }

        this.state.update((s) => {
            s.activeId = activeId;
            s.activeChild = activeChild;
        });
        this.update();
    };

    setHoveredId = (hoveredId: string) => {
        let hoveredChild = new Set<string>();
        if (hoveredId) {
            const links = this.graphData.links
                .filter((link) => {
                    const { source, target } = linkIds(link);
                    return source === hoveredId || target === hoveredId;
                })
                .flatMap((link) => {
                    const { source, target } = linkIds(link);
                    return [source, target].filter((id) => id !== hoveredId);
                });

            hoveredChild = new Set(links);
        }

        this.state.update((s) => {
            s.hoveredId = hoveredId;
            s.hoveredChild = hoveredChild;
        });
        this.update();
    };

    addZoom = () => {
        if (!this.canvas) {
            return;
        }

        const zoomBehavior = d3Zoom<HTMLCanvasElement, unknown>()
            .scaleExtent([0.1, 12])
            .filter((event) => {
                // Allow zoom only if it's not a drag event on a node
                // and if the event is not a right-click (context menu)
                return (
                    !this.isDraggingNode && !event.button && event.buttons !== 2
                );
            })
            .on("zoom", (event: D3ZoomEvent<HTMLCanvasElement, unknown>) => {
                this.setTransform(event.transform);
            });

        d3.select(this.canvas).call(zoomBehavior);
    };

    findNode = (x: number, y: number) => {
        const transform = this.state.get().transform;
        const nodes = this.graphData.nodes;

        const transformedX = transform.invertX(x);
        const transformedY = transform.invertY(y);

        return nodes.find((node) => {
            const distance = Math.sqrt(
                Math.pow(transformedX - (node.x || 0), 2) +
                    Math.pow(transformedY - (node.y || 0), 2)
            );
            return distance <= forceProperties.collide.radius;
        });
    };

    addDrag = () => {
        if (!this.canvas) {
            return;
        }

        const dragBehavior = d3Drag<HTMLCanvasElement, unknown>()
            .filter((event) => {
                // Only allow drag on left click (button 0)
                return event.button === 0;
            })
            .subject((event) => {
                // This function determines the "subject" of the drag, i.e., the node being dragged
                const node = this.findNode(event.x, event.y);
                if (node) {
                    // Set fx and fy to fix the node's position during drag
                    node.fx = node.x;
                    node.fy = node.y;
                    return node;
                }
                return null;
            })
            .on(
                "start",
                (event: D3DragEvent<HTMLCanvasElement, unknown, Node>) => {
                    if (!event.subject) return; // No node clicked, do nothing
                    this.isDraggingNode = true;
                    if (!this.simulation) return;
                    this.simulation.alphaTarget(0.2).restart(); // High alpha to quickly move node
                }
            )
            .on(
                "drag",
                (event: D3DragEvent<HTMLCanvasElement, unknown, Node>) => {
                    if (!event.subject || !this.canvas) return; // No node being dragged

                    const transform = this.state.get().transform;
                    // manually recalculate event position as current is adjusted for panning and not for zooming
                    const canvasRect = this.canvas.getBoundingClientRect();
                    const mouseXOnCanvas =
                        event.sourceEvent.clientX - canvasRect.left;
                    const mouseYOnCanvas =
                        event.sourceEvent.clientY - canvasRect.top;

                    event.subject.fx = transform.invertX(mouseXOnCanvas);
                    event.subject.fy = transform.invertY(mouseYOnCanvas);
                }
            )
            .on(
                "end",
                (event: D3DragEvent<HTMLCanvasElement, unknown, Node>) => {
                    if (!event.subject) return; // No node was dragged
                    // Release the node
                    event.subject.fx = null;
                    event.subject.fy = null;
                    this.isDraggingNode = false;
                    this.simulation?.alphaTarget(0);
                }
            );

        d3.select(this.canvas).call(dragBehavior);
    };

    nodeColor = (node: Node, activeState: ActiveState): string => {
        if (node.id === activeState.activeId) {
            return color.graph.node.selected;
        }
        if (node.id === activeState.hoveredId) {
            return color.graph.node.highlight;
        }
        return color.graph.node.default;
    };

    nodeBorderColor = (node: Node, activeState: ActiveState): string => {
        if (activeState.activeChild.has(node.id)) {
            return color.graph.nodeBorder.selected;
        }
        if (node.id === activeState.hoveredId) {
            return color.graph.nodeBorder.highlight;
        }
        if (node.id === activeState.activeId) {
            return color.graph.nodeBorder.selected;
        }
        if (activeState.hoveredChild.has(node.id)) {
            return color.graph.nodeBorder.highlight;
        }
        return color.graph.nodeBorder.default;
    };

    linkColor = (link: Link, activeState: ActiveState): string => {
        const { source, target } = linkIds(link);
        return source === activeState.activeId ||
            target === activeState.activeId
            ? color.graph.link.selected
            : color.graph.link.default;
    };

    renderData = () => {
        const context = this.canvas?.getContext("2d");
        if (!context) {
            return;
        }

        context.save();
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        const graphData = this.graphData;
        const { transform, activeId, activeChild, hoveredId, hoveredChild } =
            this.state.get();
        const activeState: ActiveState = {
            activeId,
            activeChild,
            hoveredId,
            hoveredChild,
        };
        // Apply the zoom transform to the context
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);

        graphData.links.forEach((d) => {
            context.beginPath();
            context.moveTo(
                (d.source as Node).x || 0,
                (d.source as Node).y || 0
            );
            context.lineTo(
                (d.target as Node).x || 0,
                (d.target as Node).y || 0
            );
            context.strokeStyle = this.linkColor(d, activeState);
            context.lineWidth = 0.5;
            context.stroke();
        });

        graphData.nodes.forEach((d) => {
            context.beginPath();
            context.arc(d.x || 0, d.y || 0, forceProperties.collide.radius, 0, 2 * Math.PI);
            context.fillStyle = this.nodeColor(d, activeState);
            context.fill();
            context.strokeStyle = this.nodeBorderColor(d, activeState);
            context.lineWidth = 1.5; // Node border thickness
            context.stroke();
        });

        // Only draw labels if the zoom level is sufficient (e.g., to prevent clutter when zoomed out)
        if (transform.k > 0.8) {
            graphData.nodes.forEach((d) => {
                if (
                    d.id === activeState.activeId ||
                    d.id === activeState.hoveredId ||
                    activeState.activeChild.has(d.id) ||
                    activeState.hoveredChild.has(d.id)
                ) {
                    const labelText = d.id;
                    const paddingY = 1; // Padding around the text
                    const paddingX = 2; // Padding around the text box

                    context.textAlign = "left";
                    context.textBaseline = "middle";
                    context.fillStyle = this.labelColors.text;

                    const textWidth = context.measureText(labelText).width;
                    const textHeight = 10; // Approximate height for the background box

                    const nodeRadius = forceProperties.collide.radius;
                    const labelX = (d.x || 0) + nodeRadius + 4; // Position to the right of the node
                    const labelY = d.y || 0;

                    // Draw the half-transparent background box
                    context.fillStyle = this.labelColors.background;
                    context.fillRect(
                        labelX - paddingX,
                        labelY - textHeight / 2 - paddingY,
                        textWidth + 2 * paddingX,
                        textHeight + 2 * paddingY
                    );

                    // Draw the text
                    context.fillStyle = this.labelColors.text;
                    context.fillText(labelText, labelX, labelY);
                }
            });
        }

        context.restore();
    };

    onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!this.canvas) return;
        const transform = this.state.get().transform;

        const rect = this.canvas.getBoundingClientRect();

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const transformedClickX = transform.invertX(clickX);
        const transformedClickY = transform.invertY(clickY);

        const clickedNode = this.graphData.nodes.find((node) => {
            const distance = Math.sqrt(
                Math.pow(transformedClickX - (node.x || 0), 2) +
                    Math.pow(transformedClickY - (node.y || 0), 2)
            );
            return distance <= forceProperties.collide.radius;
        });

        this.setActiveId(clickedNode?.id ?? "");
    };

    onCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const transform = this.state.get().transform;

        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const transformedClickX = transform.invertX(clickX);
        const transformedClickY = transform.invertY(clickY);

        const clickedNode = this.graphData.nodes.find((node) => {
            const distance = Math.sqrt(
                Math.pow(transformedClickX - (node.x || 0), 2) +
                    Math.pow(transformedClickY - (node.y || 0), 2)
            );
            return distance <= forceProperties.collide.radius;
        });

        this.setHoveredId(clickedNode?.id ?? "");
    };
}
