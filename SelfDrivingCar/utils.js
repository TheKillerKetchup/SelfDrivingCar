function lerp(A, B, t) {
    return A + (B - A) * t;
}

function getIntersection(A,B,C,D)
{
    const topT = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const topU = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);

    if(bottom != 0)
    {
        const t = topT/bottom;
        const u = topU/bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1){
            return { 
                x:lerp(A.x,B.x, t),
                y:lerp(A.y,B.y, t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2)
{
    for(let i = 0;i<poly1.length;i++)
    {
        for(let j = 0;j<poly2.length;j++)
        {
            const touch = getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            )
            if(touch)
            {
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value)
{
    const alpha = Math.abs(value);
    const R = value < 0 ? 255 : 0;
    const G = 0;
    const B = value > 0 ? 255 : 0;
    return ("rgba(" + R + "," + G + "," + B + "," + alpha + ")");
}